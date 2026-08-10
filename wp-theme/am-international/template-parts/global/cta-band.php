<?php
/**
 * The give band plus newsletter signup, shown at the foot of most views.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$cta_show    = am_mod( 'cta_show' );
$news_show   = am_mod( 'news_show' );
$btn1_label  = am_mod( 'cta_btn1_label' );
$btn1_url    = am_mod( 'cta_btn1_url' );
$btn2_label  = am_mod( 'cta_btn2_label' );
$btn2_url    = am_mod( 'cta_btn2_url' );
$news_action = am_mod( 'news_action' );
?>

<?php if ( $cta_show ) : ?>
<section class="cta-band">
	<div class="container cta-band__inner">
		<div data-reveal>
			<?php if ( am_mod( 'cta_eyebrow' ) ) : ?>
				<p class="eyebrow eyebrow--on-dark"><?php echo esc_html( am_mod( 'cta_eyebrow' ) ); ?></p>
			<?php endif; ?>
			<h2><?php echo esc_html( am_mod( 'cta_heading' ) ); ?></h2>
			<?php if ( am_mod( 'cta_body' ) ) : ?>
				<p class="lede"><?php echo wp_kses_post( am_mod( 'cta_body' ) ); ?></p>
			<?php endif; ?>
		</div>
		<?php if ( ( $btn1_label && $btn1_url ) || ( $btn2_label && $btn2_url ) ) : ?>
			<div class="hero__actions" data-reveal>
				<?php if ( $btn1_label && $btn1_url ) : ?>
					<a class="btn btn--lg" href="<?php echo esc_url( $btn1_url ); ?>">
						<?php echo esc_html( $btn1_label ); ?> <?php echo am_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					</a>
				<?php endif; ?>
				<?php if ( $btn2_label && $btn2_url ) : ?>
					<a class="btn btn--lg btn--ghost-light" href="<?php echo esc_url( $btn2_url ); ?>"><?php echo esc_html( $btn2_label ); ?></a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
<?php endif; ?>

<?php if ( $news_show ) : ?>
<section class="newsletter">
	<div class="container newsletter__inner">
		<div>
			<h2><?php echo esc_html( am_mod( 'news_heading' ) ); ?></h2>
			<p><?php echo wp_kses_post( am_mod( 'news_body' ) ); ?></p>
		</div>
		<?php
		// With no provider URL set, main.js intercepts the submit and says so
		// rather than posting the address nowhere.
		$attrs = $news_action
			? ' action="' . esc_url( $news_action ) . '" method="post" target="_blank"'
			: ' data-placeholder-form';
		?>
		<form class="newsletter__form"<?php echo $attrs; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above. ?>>
			<div class="field">
				<label class="visually-hidden" for="nl-email"><?php esc_html_e( 'Email address', 'am-international' ); ?></label>
				<input id="nl-email" type="email" name="EMAIL" placeholder="you@example.com" required>
			</div>
			<button class="btn" type="submit"><?php esc_html_e( 'Subscribe', 'am-international' ); ?></button>
			<p class="form-status" role="status"></p>
			<p class="form-note"><?php esc_html_e( 'We only send the monthly letter. Unsubscribe any time.', 'am-international' ); ?></p>
		</form>
	</div>
</section>
<?php endif; ?>
